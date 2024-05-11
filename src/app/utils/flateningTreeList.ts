// Flatening Tree Array
/**
 *
 * @param list (The List to Flaten)
 *
 * @param target (The o/p Faltened Array)
 */
export function setGoalListItems(list: any[],target:any[]) {
  list.forEach((item) => {
    target.push(item)
    if (item.children && item.children.length > 0) {
      this.setGoalListItems(item.children,target)
    }
  })
}
