import App from './App';
import './test/api.test';
import './test/auth.test';
import './test/cache.test';

const root = document.getElementById('root');
if (root) {
  const app = App();
  root.appendChild(app);
}
