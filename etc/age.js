class age{
}

age.countAge= function(birthday) {
        try {
            let year = birthday.split('년');
            let month = year[1].split('월');
            let day = month[1].split('일');
            let now = new Date();

            let pet_age = now.getFullYear() - year[0];

            if((month[0] <= (now.getMonth()+1)) && (day[0] < now.getDate())) {
                pet_age++;
            }
            return pet_age;
        } catch(err) {
            return err;
        }
}

module.exports = age;