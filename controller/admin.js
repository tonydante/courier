"use strict"
import jwt from 'jsonwebtoken';
import Admin from '../model/admin';
import Parcel from '../model/parcel';
import bcrypt from 'bcrypt';
require('dotenv').config()

class Admins {

  /**
   * signina new user
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  adminSignin(req, res) {
    const { username, password } = req.body;
    Admin.findOne({
      username: username.trim().toLowerCase()
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          error: 'Failed to authenticate user'
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          error: 'Failed to authenticate user'
        });
      }
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          process.env.SECRET,
          { expiresIn: 24 * 60 * 60 }
        );
        return res.status(201).send({
          token,
          message: `Welcome back ${user.username}`
        });
      }
    })
      .catch((error) => {
        res.status(500).send({
          error: error.message
        });
      });
  }


  /**
   * signup a new user
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  adminSignup(req, res) {
    const { username, password } = req.body;
    Admin.findOne({
      username: username.trim().toLowerCase()
    })
      .then((userFound) => {
        if (userFound) {
          return res.status(409).send({
            error: 'sorry user with that username already exist'
          });
        }
        const user = new Admin({
          username: username.trim().toLowerCase(),
          password

        });
        user.save().then((newUser) => {
          const token = jwt.sign(
            {
              id: newUser._id,
              username: newUser.username,
            },
            process.env.SECRET,
            { expiresIn: 24 * 60 * 60 }
          );
          return res.status(201).send({
            message: `Welcome!! ${req.body.username}`,
            user: newUser,
            token
          });
        })
          .catch((error) => {
            return res.status(400).send(error.message);
          });
      }).catch((err) => {
        return res.status(400).send({ err })
      })
  }

   /**
   * create a parcel
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  createParcel(req, res) {
    if (!req.decoded.id) {
      return res.status(403).send({
        message: 'you have no permission to create a parcel'
      });
    }
      Parcel.findOne({
        trackingNo: req.body.trackingNo.trim().toLowerCase()
      })
        .then((trackingNo) => {
          if (trackingNo) {
            return res.status(409).send({
              error: 'parcel with the trackingNo already exist'
            });
          }
          const parcel = new Parcel({
            clientName: req.body.clientName.trim().toLowerCase(),
            clientPhone: req.body.clientPhone.trim().toLowerCase(),
            clientEmail: req.body.clientEmail.trim().toLowerCase(),
            receiverName: req.body.receiverName.trim().toLowerCase(),
            receiverPhone: req.body.receiverPhone.trim().toLowerCase(),
            receiverAddress: req.body.receiverAddress.trim().toLowerCase(),
            trackingNo: req.body.trackingNo.trim().toLowerCase(),
            type: req.body.type.trim().toLowerCase(),
            weight: req.body.weight.trim().toLowerCase(),
            totalFrieght: req.body.totalFrieght.trim().toLowerCase(),
            bookingDate: req.body.bookingDate.trim().toLowerCase(),
            scheduledDate: req.body.scheduledDate.trim().toLowerCase(),
            fromCity: req.body.fromCity.trim().toLowerCase(),
            toCity: req.body.toCity.trim().toLowerCase(),
            
          });
          parcel.save().then((newParcel) => {
            return res.status(201).send({
              message: 'parcel created successfully',
              parcel: newParcel,
            });
          })
            .catch((error) => res.status(400).send(error.message));
        }).catch((err) => res.status(400).send({ err }));
   
  }


  /**
   * get all parcel
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  getAllParcels(req, res) {
    Parcel.find({})
      .then((parcels) => {
        if (parcels) {
          res.status(200).send({
            parcels,
            message: 'parcels fetched successfully',
          });
        } else {
          res.status(404).send({
            message: 'No parcel found'
          });
        }
      })
      .catch((error) => {
        res.status(400).send({
          error: error.message
        });
      });
  }

  /**
   * get one parcel
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  getOneParcel(req, res) {
    const promise = Parcel.findOne({trackingNo: req.params.id.toLowerCase()}).exec();
    promise.then((parcel) => {
      if (parcel) {
        res.status(201).send({
          parcel,
          message: 'parcel found'
        });
      } else {
        res.status(404).send({
          message: 'parcel not found'
        });
      }
    })
      .catch((error) => {
        res.status(400).send({
          error: error.message
        });
      });
  }


  /**
  * delete an parcel
  * @param {any} req user request object
  * @param {any} res servers response
  * @return {void}
  */
  deleteParcel(req, res) {
    if (!req.decoded.id) {
      return res.status(403).send({
        message: 'you have no permission to delete this parcel'
      });
    }
    Parcel.findById(req.query.id).exec()
      .then((user) => {
        console.log('got here')
        if (parcel) {
          const promise = User.remove({
            _id: req.params.id,
          }).exec();
          promise.then(() => res.status(202).send({
            message: 'parcel successfully deleted',
            parcel
          }))
            .catch((error) => {
              res.status(400).send({
                message: error.message
              });
            });

        } else {
          res.status(404).send({
            messsage: 'parcel does not exist'
          });
        }
      });
  }

  /**
  * update a parcel
  * @param {any} req user request object
  * @param {any} res servers response
  * @return {void}
  */
  updateParcel(req, res) {
    console.log(req.body, req.params, 'hello there')
    Parcel.findOne({trackingNo: req.params.id }).then((trackingNoFound) => {
      if (!trackingNoFound) {
        return res.status(404).send({
          message: 'tracking number not found'
        });
      }
      if (trackingNoFound) {
        if(trackingNoFound.trackingNo == req.body.trackingNo) {
          return res.status(409).send({
            message: 'tracking no already in use',
          });
        }
        var query = {trackingNo: req.params.id}
        const updatedTrackingNo = {
          $set: {
            trackingNo: req.body.trackingNo,
          },
        };
        Parcel.findOneAndUpdate(query, updatedTrackingNo, { new: true }).then((updated)=> {
          if (updated) {
            res.status(201).send({
              message: 'tracking number updated successfully',
              updated
            });
          } 
        }).catch(err => console.log(err))
      }
    })
  }
}


module.exports = new Admins();
