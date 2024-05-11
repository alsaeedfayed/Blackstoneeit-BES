export class Statues {
  private statusMapping: Record<number, string> = {
    1: "New",
    2: "Draft",
    3: "Closed",
    4: "Resolved",
  };

  getStatusString(statusCode: number): string {
    if (this.statusMapping.hasOwnProperty(statusCode)) {
      return this.statusMapping[statusCode];
    } else {
      return "Unknown Status";
    }
  }
}
