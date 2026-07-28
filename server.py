"""
حكايا حائل — خادم محلي بسيط
- يقدّم الملفات الثابتة (HTML/CSS/JS)
- يوجّه طلبات Gemini عبر /api/story (يتجنّب مشكلة CORS)

▶ التشغيل:
    python server.py

▶ ثم افتح: http://localhost:3003
"""

import json
import os
import ssl
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib import error, request as urlrequest

PORT = 3003


def load_env_file():
    """يقرأ .env من جذر المشروع (لا يُرفع على GitHub)."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if not os.path.isfile(env_path):
        return
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            os.environ.setdefault(key.strip(), value.strip())


load_env_file()

# 🔑 مفتاح Gemini — من .env أو متغير البيئة (لا تضعه في الكود)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

GEMINI_MODELS = [
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-flash-latest',
]

RAWI_SYSTEM_PROMPT = """أنت «راوي حائل» — راوٍ مضياف من أهل حائل، تحكي قصص المعالم التاريخية للسياح.

قواعد مهمة:
- اكتب باللهجة السعودية الحائلية المحلية (دافئة، مألوفة، بسيطة).
- القصة قصيرة: 4–6 جمل فقط، مشوقة ومليئة بالتفاصيل التاريخية.
- لا تستخدم markdown ولا قوائم — نص متصل فقط.
- ابدأ بتحية ودية واذكر اسم المعلم في البداية.
- لا تخترع معلومات غير مؤكدة — إذا لم تكن متأكداً، قل "يقولون..." أو "يروي الأجداد..." """


def _ssl_context():
    """SSL contexts — يحل CERTIFICATE_VERIFY_FAILED على بعض أجهزة Windows."""
    contexts = []
    try:
        import certifi
        contexts.append(ssl.create_default_context(cafile=certifi.where()))
    except ImportError:
        pass
    contexts.append(ssl.create_default_context())
    unverified = ssl.create_default_context()
    unverified.check_hostname = False
    unverified.verify_mode = ssl.CERT_NONE
    contexts.append(unverified)
    return contexts


def _urlopen_with_ssl(req):
    last_error = None
    for ctx in _ssl_context():
        try:
            return urlrequest.urlopen(req, timeout=30, context=ctx)
        except error.URLError as exc:
            reason = str(getattr(exc, 'reason', exc))
            if 'SSL' in reason or 'CERTIFICATE' in reason:
                last_error = exc
                continue
            raise
    raise last_error or error.URLError('SSL connection failed')


def _extract_gemini_text(data: dict) -> str | None:
    """Join all text parts — Gemini 2.5 may return multiple parts."""
    candidate = (data.get('candidates') or [{}])[0]
    parts = candidate.get('content', {}).get('parts', [])
    chunks = []
    for part in parts:
        text = part.get('text')
        if text and not part.get('thought'):
            chunks.append(text)
    if not chunks:
        chunks = [p.get('text', '') for p in parts if p.get('text')]
    combined = ''.join(chunks).strip()
    return combined or None


def call_gemini_generate(system_instruction: str, user_text: str, *, temperature=0.85, max_tokens=1024) -> str:
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'YOUR_GEMINI_API_KEY_HERE':
        raise ValueError('GEMINI_API_KEY غير مضبوط في server.py')

    payload = {
        'systemInstruction': {'parts': [{'text': system_instruction}]},
        'contents': [{
            'role': 'user',
            'parts': [{'text': user_text}],
        }],
        'generationConfig': {
            'temperature': temperature,
            'maxOutputTokens': max_tokens,
        },
    }
    body = json.dumps(payload).encode('utf-8')
    headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
    }

    last_error = None
    for model in GEMINI_MODELS:
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
        req = urlrequest.Request(url, data=body, headers=headers, method='POST')
        try:
            with _urlopen_with_ssl(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            text = _extract_gemini_text(data)
            if text:
                return text
        except error.HTTPError as exc:
            err_body = exc.read().decode('utf-8', errors='replace')
            last_error = RuntimeError(f'Gemini HTTP {exc.code}: {err_body}')
            if exc.code in (429, 404, 503):
                continue
            raise last_error from exc

    if last_error:
        err_text = str(last_error)
        if '429' in err_text or 'quota' in err_text.lower():
            raise RuntimeError(
                'تم تجاوز حصة Gemini المجانية. انتظر دقيقة وجرب مرة أخرى، '
                'أو أنشئ مفتاحاً في مشروع Google Cloud جديد من AI Studio.'
            ) from last_error
        raise last_error
    raise RuntimeError('رد فارغ من Gemini')


def call_gemini(landmark_name: str) -> str:
    return call_gemini_generate(
        RAWI_SYSTEM_PROMPT,
        f'احكِ لي قصة مشوقة عن معلم "{landmark_name}" في مدينة حائل.',
    )


def call_gemini_chat(question: str, system_instruction: str) -> str:
    return call_gemini_generate(system_instruction, question, temperature=0.75, max_tokens=1024)


class HakaiaHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # منع تخزين JS/CSS القديم أثناء التطوير
        if self.path.endswith(('.js', '.css', '.html')):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        print(f'[{self.log_date_time_string()}] {format % args}')

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/ping':
            response = json.dumps({
                'ok': True,
                'version': 2,
                'aqKeysSupported': True,
            }).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(response)
            return

        if self.path == '/api/chat':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body.decode('utf-8'))
                question = data.get('question', '').strip()
                system_instruction = data.get('systemInstruction', '').strip()
                if not question:
                    raise ValueError('question مطلوب')
                if not system_instruction:
                    raise ValueError('systemInstruction مطلوب')

                reply = call_gemini_chat(question, system_instruction)
                response = json.dumps({'reply': reply}, ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(response)
            except Exception as exc:
                message = str(exc)
                print(f'[Chat Error] {message}')
                response = json.dumps({'error': message}, ensure_ascii=False).encode('utf-8')
                self.send_response(502)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(response)
            return

        if self.path != '/api/story':
            self.send_error(404, 'Not Found')
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        try:
            data = json.loads(body.decode('utf-8'))
            landmark_name = data.get('landmarkName', '').strip()
            if not landmark_name:
                raise ValueError('landmarkName مطلوب')

            story = call_gemini(landmark_name)
            response = json.dumps({'story': story}, ensure_ascii=False).encode('utf-8')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(response)

        except Exception as exc:
            message = str(exc)
            print(f'[Gemini Error] {message}')
            response = json.dumps({'error': message}, ensure_ascii=False).encode('utf-8')
            self.send_response(502)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(response)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = HTTPServer(('localhost', PORT), HakaiaHandler)
    print(f'Hakaia Hail running at http://localhost:{PORT}')
    print('AQ keys supported (v2) — restart required after code updates')
    print('Press Ctrl+C to stop')
    server.serve_forever()
