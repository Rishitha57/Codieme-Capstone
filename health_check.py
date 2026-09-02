import urllib.request

try:
    r = urllib.request.urlopen('http://localhost:4173')
    print('Health check PASSED:', r.status)
except Exception as e:
    print('Health check FAILED:', e)