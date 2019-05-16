import moment from 'moment';
import {getMetrics} from '../../app/src/utils/metrics'
import {KILOGRAM} from '../../app/src/Units'

it('getMetrics should return valid object', () => {

    const training = {
        id: 'new',
        startedAt: moment().format('YYYY-MM-01 10:45:00'),
        completedAt: moment().format('YYYY-MM-01 13:00:00'),
        humanWeight: {
            value: 100,
            unit: KILOGRAM
        },
        workouts: {
            1: {
                id: 1,
                exercise: {
                    muscleGroup: 'legs'
                },
                repeats: {
                    1: {
                        id: 1,
                        isHumanWeight: true,
                        repeatCount: 10,
                        weight: {
                            value: 100,
                            unit: KILOGRAM
                        }
                    },
                    2: {
                        id: 2,
                        isHumanWeight: true,
                        repeatCount: 10,
                        weight: {
                            value: 100,
                            unit: KILOGRAM
                        }
                    }
                }
            },
            2: {
                id: 2,
                exercise: {
                    muscleGroup: 'legs'
                },
                repeats: {
                    1: {
                        id: 1,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 20,
                            unit: KILOGRAM
                        }
                    },
                    2: {
                        id: 2,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 23,
                            unit: KILOGRAM
                        }
                    }
                }
            },
            3: {
                id: 3,
                exercise: {
                    muscleGroup: 'shoulders'
                },
                repeats: {
                    1: {
                        id: 1,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 10,
                            unit: KILOGRAM
                        }
                    },
                    2: {
                        id: 2,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 15,
                            unit: KILOGRAM
                        }
                    }
                }
            },
            4: {
                id: 4,
                exercise: {
                    muscleGroup: 'shoulders'
                },
                repeats: {
                    1: {
                        id: 1,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 20,
                            unit: KILOGRAM
                        }
                    },
                    2: {
                        id: 2,
                        isHumanWeight: false,
                        repeatCount: 10,
                        weight: {
                            value: 22,
                            unit: KILOGRAM
                        }
                    }
                }
            }
        }
    }

    const metrics = getMetrics(training, training.startedAt, training.completedAt, KILOGRAM)

    expect(metrics.duration).toBe(2.25)
    expect(metrics.totalWeightPerHour).toBe(1.38)

    expect(metrics.totalWeight).not.toBe(undefined)
    expect(metrics.totalWeight.value).toBe(3100)
    expect(metrics.totalWeight.unit).toBe(KILOGRAM)

    expect(metrics.groupedWeight).not.toBe(undefined)
    expect(metrics.groupedWeight.legs).not.toBe(undefined)
    expect(metrics.groupedWeight.shoulders).not.toBe(undefined)

    expect(metrics.groupedWeight.legs.exerciseCount).toBe(2)
    expect(metrics.groupedWeight.shoulders.exerciseCount).toBe(2)

    expect(metrics.groupedWeight.legs.totalWeightPerHour).toBe(2.16)
    expect(metrics.groupedWeight.shoulders.totalWeightPerHour).toBe(0.6)

    expect(metrics.groupedWeight.legs.totalWeight.value).toBe(2430)
    expect(metrics.groupedWeight.shoulders.totalWeight.value).toBe(670)

    expect(metrics.groupedWeight.legs.totalWeight.unit).toBe(KILOGRAM)
    expect(metrics.groupedWeight.shoulders.totalWeight.unit).toBe(KILOGRAM)
})
