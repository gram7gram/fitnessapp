import random from "random";

export const fromArray = arr => arr[random.int(0, arr.length - 1)]