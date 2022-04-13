import Express, { Application } from 'express';
import Morgan from 'morgan';
import Cors from 'cors';
import { json } from 'body-parser';
import { config } from 'dotenv';
import handleError from './middleware/error.middleware';
import { authApi } from './components/auth/api/auth.api';
import { userApi } from './components/user/api/user.api';
import { emergencyTypeApi } from './components/emergencyType/api/emergency.type.api';
import { priorityTypeApi } from './components/priority/api/priority.api';
import { medicalCenterApi } from './components/medicalCenter/api/emergency.type.api';
import { monitoringApi } from './components/monitoring/api/monitoring.api';
import { reportApi } from './components/report/api/report.api';
import { prescriptionApi } from './components/prescription/api/prescription.api';
import { AlertApi } from './components/alert/api/alert.api';

export default class App {
  private app: Application;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    config();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(Morgan('dev'));
    this.app.use(Cors());
  }

  routes() {
    this.app.get('/', json(), (req, res) => {
      res.send('Hello World!');
    });
    this.app.use('/user', json(), userApi);
    this.app.use('/auth', json(), authApi);
    this.app.use('/emergency', json(), emergencyTypeApi);
    this.app.use('/priority', json(), priorityTypeApi);
    this.app.use('/center', json(), medicalCenterApi);
    this.app.use('/monitoring', json(), monitoringApi);
    this.app.use('/report', json(), reportApi);
    this.app.use('/prescription', json(), prescriptionApi);
    this.app.use('/alert', json(), AlertApi);
    this.app.use(handleError);
  }

  async listen() {
    this.app.listen(this.app.get('port'));
    console.log('App listening to port', this.app.get('port'));
  }
}
