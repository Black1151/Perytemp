import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears
} from "date-fns";

type WeeklyDateRangeValue =
    | "currentWeek"
    | "previousWeek"
    | "last2Weeks"
    | "last4Weeks"
    | "last8Weeks"
    | "last12Weeks"
    | "last24Weeks"
    | "last36Weeks"
    | "last48Weeks"
    | "currentYear"
    | "previousYear";

type MonthlyDateRangeValue =
    | "currentMonth"
    | "previousMonth"
    | "last3Months"
    | "last6Months"
    | "last9Months"
    | "last12Months"
    | "currentYear"
    | "previousYear"
    | "last2Years"

type YearlyDateRangeValue =
    | "currentYear"
    | "previousYear"
    | "last2Years"
    | "last3Years"
    | "last4Years"
    | "last5Years"


export type DateRangeMode = "weekly" | "monthly" | "yearly";

export type ModeValueMap = {
    weekly: WeeklyDateRangeValue;
    monthly: MonthlyDateRangeValue;
    yearly: YearlyDateRangeValue;
};

export interface DateRangeItem {
    name: string;
    value: string;
    getRange: () => [Date, Date];
}

export const dateRangeOptions: Record<DateRangeMode, DateRangeItem[]> = {
    weekly: [
        {
            name: "Current Week",
            value: "currentWeek",
            getRange: () => [
                startOfWeek(new Date(), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Previous Week",
            value: "previousWeek",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}),
                endOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 2 Weeks",
            value: "last2Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 4 Weeks",
            value: "last4Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 3), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 8 Weeks",
            value: "last8Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 7), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 12 Weeks",
            value: "last12Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 11), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 24 Weeks",
            value: "last24Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 23), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 36 Weeks",
            value: "last36Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 35), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Last 48 Weeks",
            value: "last48Weeks",
            getRange: () => [
                startOfWeek(subWeeks(new Date(), 47), {weekStartsOn: 1}),
                endOfWeek(new Date(), {weekStartsOn: 1})
            ],
        },
        {
            name: "Current Year",
            value: "currentYear",
            getRange: () => [startOfWeek(startOfYear(new Date()), {weekStartsOn: 1}), endOfWeek(endOfYear(new Date()), {weekStartsOn: 1})]
        },
        {
            name: "Previous Year",
            value: "previousYear",
            getRange: () => {
                const lastYearDate = subYears(new Date(), 1);
                return [startOfWeek(startOfYear(lastYearDate), {weekStartsOn: 1}), endOfWeek(endOfYear(lastYearDate), {weekStartsOn: 1})];
            }
        }
    ],
    monthly: [
        {
            name: "Current Month",
            value: "currentMonth",
            getRange: () => [startOfMonth(new Date()), endOfMonth(new Date())],
        },
        {
            name: "Previous Month",
            value: "previousMonth",
            getRange: () => [
                startOfMonth(subMonths(new Date(), 1)),
                endOfMonth(subMonths(new Date(), 1))
            ],
        },
        {
            name: "Last 3 Months",
            value: "last3Months",
            getRange: () => [
                startOfMonth(subMonths(new Date(), 2)),
                endOfMonth(new Date())
            ],
        },
        {
            name: "Last 6 Months",
            value: "last6Months",
            getRange: () => [
                startOfMonth(subMonths(new Date(), 5)),
                endOfMonth(new Date())
            ],
        },
        {
            name: "Last 9 Months",
            value: "last9Months",
            getRange: () => [
                startOfMonth(subMonths(new Date(), 8)),
                endOfMonth(new Date())
            ],
        },
        {
            name: "Last 12 Months",
            value: "last12Months",
            getRange: () => [
                startOfMonth(subMonths(new Date(), 11)),
                endOfMonth(new Date())
            ],
        },
        {
            name: "Current Year",
            value: "currentYear",
            getRange: () => [startOfYear(new Date()), endOfYear(new Date())]
        },
        {
            name: "Previous Year",
            value: "previousYear",
            getRange: () => {
                const lastYearDate = subYears(new Date(), 1);
                return [startOfYear(lastYearDate), endOfYear(lastYearDate)];
            }
        },
        {
            name: "Last 2 Years",
            value: "last2Years",
            getRange: () => {
                return [startOfYear(subYears(new Date(), 1)), endOfYear(new Date())];
            }
        }
    ],
    yearly: [
        {
            name: "Current Year",
            value: "currentYear",
            getRange: () => [startOfYear(new Date()), endOfYear(new Date())]
        },
        {
            name: "Previous Year",
            value: "previousYear",
            getRange: () => {
                const lastYearDate = subYears(new Date(), 1);
                return [startOfYear(lastYearDate), endOfYear(lastYearDate)];
            }
        },
        {
            name: "Last 2 Years",
            value: "last2Years",
            getRange: () => {
                return [startOfYear(subYears(new Date(), 1)), endOfYear(new Date())];
            }
        },
        {
            name: "Last 3 Years",
            value: "last3Years",
            getRange: () => {
                return [startOfYear(subYears(new Date(), 2)), endOfYear(new Date())];
            }
        },
        {
            name: "Last 4 Years",
            value: "last4Years",
            getRange: () => {
                return [startOfYear(subYears(new Date(), 3)), endOfYear(new Date())];
            }
        },
        {
            name: "Last 5 Years",
            value: "last5Years",
            getRange: () => {
                return [startOfYear(subYears(new Date(), 4)), endOfYear(new Date())];
            }
        }
    ]
};