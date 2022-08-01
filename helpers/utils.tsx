export function getActivityWithId(activity: any) {
    return {
        id: activity.id,
        ...Object.assign({}, activity.data())
    }
}