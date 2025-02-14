import React from 'react';

export function Login() {
  return (
    <main class="container-fluid bg-secondary text-center">
      <div>
        <h1>PenPal</h1>
        <form method="get" action="play.html">
          <div class="input-group mb-3">
            <span class="input-group-text">@</span>
            <input class="form-control" type="text" placeholder="your@email.com" />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">🔒</span>
            <input class="form-control" type="password" placeholder="password" />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <button type="submit" class="btn btn-secondary">Create</button>
        </form>
      </div>
    </main>
  );
}
