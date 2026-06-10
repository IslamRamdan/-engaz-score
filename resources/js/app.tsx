import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import LoadingScreen from "./Components/LoadingScreen";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        // جلب جميع الملفات المتاحة في مجلد Pages بدون التقييد بحالة الأحرف
        const pages = import.meta.glob("./Pages/**/*.tsx");

        // محاولة البحث عن الملف بالمسار المطلوب مباشرة
        let match = pages[`./Pages/${name}.tsx`];

        // إذا لم يجده، يبحث في الملفات بشكل مرن يتجاهل الحروف الكبيرة والصغيرة (Case-Insensitive)
        if (!match) {
            const lowerRequired = `./pages/${name}.tsx`.toLowerCase();
            const foundKey = Object.keys(pages).find(
                (key) => key.toLowerCase() === lowerRequired,
            );
            if (foundKey) {
                match = pages[foundKey];
            }
        }

        // إذا فشل تماماً، نترك الأداة الافتراضية تعطي الخطأ الأصلي للمساعدة في التتبع
        if (!match) {
            return resolvePageComponent(`./Pages/${name}.tsx`, pages);
        }

        return typeof match === "function" ? match() : match;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                {/* شاشة التحميل العامة - تظهر عند الانتقال بين أي صفحتين */}
                <LoadingScreen />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: "#10b981",
    },
});
