import app from '@app';
import env from '@env';

app.listen(env.PORT || 5000, () => console.log('Server running'));
