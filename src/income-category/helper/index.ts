import { CreateIncCatDto } from "../dto/create-income-category.dto";
import { IncomeType } from "../enums/income-type.enum";


export const generalIncomeCategories: CreateIncCatDto[] = [
    {
        title: "Gaji",
        income_type: IncomeType.Active
    },
    {
        title: "Bonus",
        income_type: IncomeType.Active
    },
    {
        title: "Freelance",
        income_type: IncomeType.Active
    },
    {
        title: "Trading",
        income_type: IncomeType.Active
    },
    {
        title: "Bisnis Penyewaan",
        income_type: IncomeType.Passive
    },
]