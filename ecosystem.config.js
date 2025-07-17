module.exports = {
  apps: [
    {
      name: "backend",         // اسم التطبيق عند تشغيله مع PM2
      script: "./dist/main.js",     // ملف الدخول (Entry point) لتطبيقك
      instances: 1,           // عدد العمليات (processes) التي تريد تشغيلها (1 تعني عملية واحدة)
      autorestart: true,      // هل يعيد تشغيل التطبيق تلقائيًا عند توقفه؟
      watch: false,           // هل يراقب التغييرات في الملفات ويعيد التشغيل؟
      max_memory_restart: "200M", // إعادة تشغيل إذا تجاوز استهلاك الذاكرة 200 ميجابايت
      env: {
        NODE_ENV: "development"  // متغيرات بيئة التطوير
      },
      env_production: {
        NODE_ENV: "production"   // متغيرات بيئة الإنتاج
      }
    }
  ]
};
