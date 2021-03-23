export const mongoUrl = undefined;

export const jwt = {
  secret: "supersecret",
  cookie: {
    cookieName: "token"
  }
};

export const smtp = {
  host: "mboxhosting.com",
  port: 25,
  secure: false,
  auth: {
    user: "",
    pass: ""
  },
  from: '"system management" <server@some-domain.com>',
  sendPermission: {
    subject: "הרשאות למערכת",
    html: link => `<div dir="rtl">
                             <h1>שלום</h1>
                             <h2>יש לך הרשאות עבור מערכת</h2>
                             <a href="${link}">
                                  היכנס
                             </a>
                         </div>`
  }
};

export const corsOptions = {
  origin: ["https://localhost:4200", "http://localhost:4200"],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

export const clientUrl = "http://localhost:4200";
