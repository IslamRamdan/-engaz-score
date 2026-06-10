export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

// نوع الشركة المسجلة - يُستخدم في السايد بار والتخطيطات الداخلية
export interface Company {
    id?: number;
    name: string;
    email?: string;
    city?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        company?: Company; // بيانات الشركة المرتبطة بالمستخدم الحالي
    };
};
