import app from '@app';
import env from '@env';
import agenda from '@job';

const runServer = async () => {
  try {
    await app.listen(env.PORT || 5000, () => console.log('Server running'));
    await agenda.start();
    console.log('Agenda running!');
  } catch (error) {
    console.error('Failed to start services:', error);
  }
};

runServer();
