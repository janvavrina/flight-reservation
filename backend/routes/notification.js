const express = require("express");
const router = express.Router();
const {jwtConfig} = require("../config");
const userService = require("../services/user-service");
const notificationService = require("../services/notification-service")

router.post('/',async (req,res) => {
    const userId = req.user.id;
    const user = await userService.getById(userId);
    const notification = req.body;

    if(user.users_role==='zakaznik'){
        res.status(401).send("Unauthorized.");
        return;
    }

    if(notification.type===undefined || notification.type.trim()===""||
        notification.status===undefined || notification.status.trim()==="" ||
        notification.text===undefined || notification.text.trim()===""
    ){
        res.status(400).send("Bad input");
        return;
    }

    const result = await notificationService.create(notification)
    res.status(201).json(result);
})

router.get('/',async (req,res) => {
    const userId = req.user.id
    const user = await userService.getById(userId)
    let notifications;

    if(user.users_role==='zakaznik') {
        notifications = await notificationService.getAllUsersNotifications(userId);
    }
    else if(user.users_role==='sekretarka' || user.users_role==='technik') {
        notifications = await notificationService.getAllNotifications();
    }
    else {
        res.status(404).send("Who the fuck are you?");
        return;
    }

    if(notifications !== undefined){
        res.json(notifications);
    }
    else{
        res.status(404).send("No reservations found.");
        return;
    }
})

router.get('/users',async (req,res) => {
    const userId = req.user.id;
    const user = await userService.getById(userId);
    const users = await userService.getAllUsers();

    if(user.users_role!=='technik' && user.users_role!=='sekretarka') {
        res.status(401).send("Unauthorized.");
        return;
    }

    if(users !== undefined){
        res.json(users);
    }
    else{
        res.status(404).send("Flight not found. Flight flew away.");
        return;
    }
})


router.put('/update', async (req, res) => {
    const data = req.body;
    const userId = req.user.id
    const user = await userService.getById(userId)

    const notificationId = data.id;
    let notification;

    if (
        isNaN(notificationId) ||
        data.status === undefined || data.status?.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const checkNoti = await notificationService.getById(notificationId)

    if(checkNoti.users_id===null && user.users_role==='zakaznik'){
        res.status(401).send("Unauthorized to hide or archive global notifications.");
        return;
    }

    if((checkNoti.users_id !== user.users_id) && user.users_role==='zakaznik'){
        res.status(401).send("Unauthorized to hide or archive others notifications.");
        return;
    }

    if(data.status==='hidden'){
        notification = await notificationService.hideNotification(notificationId)
    }

    if(data.status==='archived'){
        notification = await notificationService.archiveNotification(notificationId)
    }

    res.status(202).json(notification);
})

module.exports = router;