const mongoose = require('mongoose');
const bcript = require('bcrypt')
const jwt = require('jsonwebtoken')
const emplooyeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    crtpassword: {
        type: String,
        required: true
    },
    cnfpassword: {
        type: String,
        required: true
    },
    token: [{
        token: {
            type: String,
            required: true
        }
    }]
})

emplooyeSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        let token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.token = this.token.concat({ token: token })
        console.log(token)
        await this.save();
        return token;
    } catch (error) {
        res.status(400).send(error)
    }
};

emplooyeSchema.pre("save", async function (next) {
    if (this.isModified("cnfpassword")) {
        console.log(`The current password is ${this.cnfpassword}`)
        this.cnfpassword = await bcript.hash(this.cnfpassword, 10)
        console.log(`The current password is ${this.cnfpassword}`)
        // this.crtpassword = undefined;
    }

    next();
})

const Register = new mongoose.model('registerd', emplooyeSchema);
module.exports = Register;