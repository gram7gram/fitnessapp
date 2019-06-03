
### Workout app

![Preview](https://github.com/gram7gram/fitnessapp/blob/master/preview.jpg)

### Storage

Android `/data/user/0/ua.gram.fitnessapp/files`

### Schema

```
Training {
    id: string
    createdAt: datetime
    startedAt: datetime
    completedAt: datetime
    unit: string
    humanWeight: Weight
    duration: float
    totalWeight: Weight
    totalWeightPerHour: Weight
    workouts: Array<Workout>
}
```

```
Exercise {
    id: string
    isHumanWeight: ?boolean
    muscleGroup: String
    scale: Number
    image: ?string
    translations: Array<Translation>
    variants: ?Array<Exercise>
}
```

```
Workout {
    id: string
    createdAt: datetime
    exercise: Exercise
    totalWeight: Weight
    repeats: Array<Repeat>
}
```

```
Repeat {
    id: string
    createdAt: datetime
    weight: Weight
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

```
Weight {
    value: float
    unit: string
}
```