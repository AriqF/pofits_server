import { CreateIncCatDto } from "../dto/create-income-category.dto";
import { IncomeType } from "../enums/income-type.enum";


export const generalIncomeCategories: CreateIncCatDto[] = [
    {
        title: "Gaji",
        income_type: IncomeType.Active,
        icon: "loan",
    },
    {
        title: "Bonus",
        income_type: IncomeType.Active,
        icon: "fees",
    },
    {
        title: "Freelance",
        income_type: IncomeType.Active,
        icon: "hacker",
    },
    {
        title: "Trading",
        income_type: IncomeType.Active,
        icon: "chart"
    },
    {
        title: "Bisnis Penyewaan",
        income_type: IncomeType.Passive,
        icon: "clipboard"
    },
]