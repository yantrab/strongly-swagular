export const smtp = {
  host: "???.com",
  port: 25,
  secure: false,
  auth: {
    user: "server@???",
    pass: "???"
  },
  from: '"system management" <server@???>',
  sendPermission: {
    subject: "הרשאות למערכת ",
    html: (link, name) => `<div dir="rtl">
                             <h1 
                             style="width:119px; height:47px; font-family:Roboto; font-size:40px; font-weight:300; 
                             text-align:left; color:#222222; display:inline">
                             Hello ${name}
                             </h1>
                             <h2>You got new permission to ??? application!</h2>
                             <table cellpadding="0" cellspacing="0" border="0" style="padding:17px 0px 0 40px">
                             <tbody><tr><td width="183PX" style="width:183px; font-family:Roboto,calibri; font-size:16px; font-weight:normal; font-style:normal; 
                             font-stretch:normal; background-color:#7a48a3; text-decoration:none; border-radius:6px; padding:10px 0; text-align:center">
                             <a href=${link}" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" style="color:#FFF; text-decoration:none; font-family:Roboto,Calibri" data-linkindex="0">TAKE ME THERE</a> 
                             </td></tr></tbody></table>
                         </div>`
  }
};


export const mongoUrl = undefined;

export const jwt = {
  secret: "supersecret",
  cookie: {
    cookieName: "token"
  }
};

export const corsOptions = {
  origin: ["https://localhost:4200", "http://localhost:4200"],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

export const clientUrl = "http://localhost:4200";
