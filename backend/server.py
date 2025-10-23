#!/usr/bin/env python3
"""
FastAPI proxy to Node.js backend
"""
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import subprocess
import threading
import time
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NODE_PORT = 8002
NODE_URL = f"http://localhost:{NODE_PORT}"

# Start Node.js server in background
def start_node_server():
    env = os.environ.copy()
    env["PORT"] = str(NODE_PORT)
    subprocess.run(["node", "index.js"], cwd="/app/backend", env=env)

thread = threading.Thread(target=start_node_server, daemon=True)
thread.start()

# Give Node.js time to start
time.sleep(2)

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(request: Request, path: str):
    """Proxy all requests to Node.js backend"""
    try:
        async with httpx.AsyncClient() as client:
            url = f"{NODE_URL}/{path}"
            if request.url.query:
                url += f"?{request.url.query}"
            
            response = await client.request(
                method=request.method,
                url=url,
                headers=dict(request.headers),
                content=await request.body(),
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
            )
    except Exception as e:
        return {"error": str(e), "path": path}
