const express = require("express");
const path = require("path");
const expSession = require("express-session");
const users = require("./users.json");
const expHbs = require("express-handlebars");

const app = express();

app.engine(
  "handlebars",
  expHbs({
    defaultLayout: "main",
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(
  expSession({
    secret: ",m.nlkcazxdfsñ,.lmjkncvfaxsdzm,.ncxzv,m.n-czxv.,jmk-cxvz.,-mjkczxv",
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.use(express.static(path.join(__dirname, "client")));

app.post("/login", (req, res) => {
  const user = getUser(req.body.usr, req.body.pwd);

  if (user) {
    req.session.username = user.username;
    req.session.name = user.name;
    req.session.usrImg = user.userImg;

    console.log(req.session);

    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

app.get("/home", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
    return;
  }

  res.render("home", {
    name: req.session.name,
    userPic: req.session.usrImg,
  });
});

app.get("/datos", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
    return;
  }

  res.render("datos", {
    name: req.session.name,
    username: req.session.username,
    userPic: req.session.usrImg,
  });
});

app.get("/compras", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
    return;
  }

  // consulto a la base de datos las compras del usuarix req.session.username
  const comprasUsr = getCompras(req.session.username);

  res.render("compras", {
    name: req.session.name,
    userPic: req.session.usrImg,
    compras: comprasUsr
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Escuchando en puerto 3000...");
});

function getUser(usr, pwd) {
  return users.find((user) => user.username === usr && user.pass === pwd);
}

function getCompras(username) {
  // Esto es un mock, retorno siempre lo mismo, no importa el username
  // (más adelante lo implementamos con bases de datos)
  return [
    { prod: "cuchara", valor: 10 },
    { prod: "tenedor", valor: 8 },
  ];
}
