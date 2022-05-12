const express = require('express');
const PORT = 3000;

let app = express();

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}.`);
});