import http from 'http';

export default function initServer(serverToInit: http.Server) {
  serverToInit.listen(3001, () => {
    console.log('Server is running');
  });
}
