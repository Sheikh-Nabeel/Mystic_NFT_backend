import mongoose,{Schema} from "mongoose";

const reservationschema=new Schema({
    nftid:{
        type:Schema.Types.ObjectId,
        ref:'NFT'
    },
    userid:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reservationDate:{
        type:Date,
        default:Date.now
    },
    reservationtime:{
        type:String,
        required:true
    },
status: {
    type: String,
    enum: ['reserved', 'bought', 'sold'],
    default: 'reserved'
},
referralProfitDistributed: {
    type: Boolean,
    default: false
},
nftname:{
    type:String,
},

buyAmount: Number,
buyDate: Date,
sellDate: Date,
profit: Number
 


 
},{
    timestamps:true})
export const Reservation = mongoose.model("Reservation", reservationschema);