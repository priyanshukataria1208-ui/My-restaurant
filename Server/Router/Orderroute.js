const router=require("express").Router()
const OrderC=require("../Controller/Ordercontroller")
const checkGuestandUser = require("../middleware/checkGuestandUser")


router.post("/order",checkGuestandUser,OrderC.createOrder)
router.post("/verify/payment",checkGuestandUser,OrderC.verifypayment)
router.get("/order",checkGuestandUser,OrderC.getorder)
router.get("/order/:id", checkGuestandUser, OrderC.getOrderById);

router.get("/order/monthly-sales",OrderC.monthlysales)



module.exports=router