import React from 'react';
import {Router, Scene, Stack} from 'react-native-router-flux';

import LandingPage from '../pages/LandingPage/components';
import ExercisePage from '../pages/ExercisePage/components';
import TrainingPage from '../pages/TrainingPage/components';
import WorkoutPage from '../pages/WorkoutPage/components';

export default () => <Router>
    <Stack key='root' hideNavBar>

        <Scene key='landing'
               initial={true}
               path="/trainings"
               component={LandingPage}/>

        <Scene key='training'
               path="/trainings/:training"
               component={TrainingPage}/>

        <Scene key='exercise'
               path="/trainings/:training/exercises"
               component={ExercisePage}/>

        <Scene key='workout'
               path="/trainings/:training/exercises/:exercise/workouts"
               component={WorkoutPage}/>

    </Stack>
</Router>
