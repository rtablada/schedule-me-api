var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  roles: [{type: String}],
  firstName: {type: String},
  lastName: {type: String},
  phone: {type: String},
  specialty: {type: String},
  clientAppointments: [{ type: ObjectId, ref: 'AppointmentItem' }],
  calendarAppointments: [{ type: ObjectId, ref: 'AppointmentItem' }],
});

UserSchema.path('password').set(function(value) {
  if (!value) {
    return this.password;
  }

  var salt = bcrypt.genSaltSync();

  return bcrypt.hashSync(value, salt);
});

UserSchema.methods.checkPassword = function(value, success, failure) {
  bcrypt.compare(value, this.password, function(err, result) {
    if (result) {
      success();
    } else {
      failure(err);
    }
  });
};

module.exports = mongoose.model('User', UserSchema);
