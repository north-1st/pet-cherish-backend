import app from '@app';
import agenda from '@job';

const runServer = async () => {
  try {
    await app.listen(5000, () => console.log('Server running!'));
    await agenda.start();
    console.log('Agenda running!');
  } catch (error) {
    console.error('Failed to start services:', error);
  }
};

runServer();
