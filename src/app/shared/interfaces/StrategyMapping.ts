export interface GoalType {
  id: number;
  name: string;
  arabicName: string;
  description: string;
  color: string;
  category: number;
  isEnabled: boolean;
}

export interface StrategyMappingKPI {
  id: number;
  title: string;
  titleAr: string;
  goalTypeId: number;
  goalType: GoalType;
  checked: boolean;
  isChecked?: boolean;
  open?: boolean;
  children: StrategyMappingKPI[]; // You might want to replace 'any' with a more specific type if you know the structure
}