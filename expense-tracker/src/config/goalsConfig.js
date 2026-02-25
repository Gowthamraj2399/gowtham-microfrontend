export const goalStats = [
  {
    id: 1,
    title: "Total Saved",
    value: "$12,500",
    icon: "savings",
    iconColor: "text-primary",
    progress: 27,
  },
  {
    id: 2,
    title: "Active Goals",
    value: "4",
    icon: "flag",
    iconColor: "text-purple-400",
    subLabel: "2 completed this year",
  },
  {
    id: 3,
    title: "Next Deadline",
    value: "Aug 24, 2024",
    icon: "event",
    iconColor: "text-green-400",
    subLabel: "Bali Summer Trip",
  },
];

export const goals = [
  {
    id: 1,
    title: "Bali Summer Trip",
    targetDate: "Aug 2024",
    saved: 1625,
    target: 2500,
    percentage: 65,
    progressColor: "bg-primary",
    monthlyContribution: 200,
    monthsLeft: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Bc40Yfd9jKTYTJ-NfHlEWW_Ts8buKFLSvCFM-BzVddFtDNITkkM8qOA2lUHIwSu6__bfB4KAF3s70MLok6cPh5dYbrAPLhHq57Spnz6daRXEh4ZLVeLNgUsUNhtiBHev5LhtMCeOMWuV3rvcvQNLgeVTJ61P3q-BmZDEL4Uog6sPBdjLNvLYAECincrYXCB99UAbB_fShyyFj78QtW6vXOHjUIva1BgJMDAtPGRDOir1bIipX32AzsoK_TelP0F9tzmLTxtC-GNM",
    imageAlt: "Tropical beach scene with palm trees",
  },
  {
    id: 2,
    title: "MacBook Pro Upgrade",
    targetDate: "Dec 2024",
    saved: 800,
    target: 4000,
    percentage: 20,
    progressColor: "bg-yellow-500",
    monthsLeft: 8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Z4JhPJHfgiahdRbhuqUYXDYT0dibaPJKheqJw4BIFazgV1QRhMzrsAlf-DozI7imvvsV9NPs06aZqKd6i53bio_KZ4wr9mKUMkDJPuNk4XI5jN_SlnjDwx6ICnnDXN7_9wqUuttjoB_LV10lXFrmWPbkBcBt05R_qaarPqb-wVJNT2oCFhhC5n-x3pRMJNeYa0dC2xe2Sl3Y36rLFAyYmP0Wo0VPHv8B0QFDU_K4JDAyTSmw7ObpGlmrLHc9Mx6-NxevJ4dKXrzk",
    imageAlt: "Modern laptop on a desk workspace",
  },
  {
    id: 3,
    title: "Emergency Fund",
    targetDate: "Ongoing",
    saved: 9000,
    target: 10000,
    percentage: 90,
    progressColor: "bg-green-500",
    statusMessage: "Almost there!",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATCa3fPT-tV-s7UgLE0MoJ7FC3icd-Mh4RQjeElBHA_KbHwndslEUilMsUB0ZUb_oegedRnoUHDdto1TrudcBWff7kW_uaLzsJpZxq6PFjGrNI9rt67AdXPZ2yz7D9w-5dKmXDjXWL-lGy5l06OZTyYtqrx8f8ycKRL_egqol2xTyqZrAMo8z6DwqVDPUlcG83UkusdChlMFsmXbyokqjicZTaD4bnSy1SMKFgu5GMhocVYTAZBYp0gipOlf63g6WRCyj482T0ghF9",
    imageAlt: "Emergency medical symbol or piggy bank",
  },
];

export const recentActivity = [
  {
    id: 1,
    goalName: "Bali Trip",
    amount: 200,
    timestamp: "Today, 10:23 AM",
    icon: "flight",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    id: 2,
    goalName: "MacBook Pro",
    amount: 50,
    timestamp: "Yesterday",
    icon: "laptop_mac",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-500",
  },
  {
    id: 3,
    goalName: "Emergency Fund",
    amount: 500,
    timestamp: "May 12, 2024",
    icon: "local_hospital",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-500",
  },
  {
    id: 4,
    goalName: "Home Renovation",
    amount: 150,
    timestamp: "May 10, 2024",
    icon: "home",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
    isOld: true,
  },
];

export const motivationData = {
  title: "Keep it up!",
  message:
    "You've reached 27% of your total savings goal. Adding just $50 more this week keeps you on track.",
  buttonText: "Boost Savings",
};
