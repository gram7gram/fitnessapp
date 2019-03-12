
### Storage

Android `/data/user/0/com.fitnessapp/files`

### Schema

```
Training {
    id: string
    createdAt: datetime
    startedAt: datetime
    completedAt: datetime
    humanWeight: float
    duration: float
    totalWeight: float
    totalWeightPerHour: float
    workouts: Array<Workout>
}
```

```
Exercise {
    id: string
    isHumanWeight: ?boolean
    translations: Array<Translation>
    variants: ?Array<Exercise>
    children: ?Array<Exercise>
}
```

```
Workout {
    id: string
    createdAt: datetime
    training: Training
    exercise: Exercise
    totalWeight: float
    repeats: Array<Repeat>
}
```

```
Repeat {
    id: string
    createdAt: datetime
    workout: Workout
    weight: float
    repeatCount: float
    isHumanWeight: boolean
}
```

```
Translation {
    locale: string
    name: string
}
```