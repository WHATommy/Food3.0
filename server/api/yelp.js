const express = require('express');
const router = express.Router();
const yelp = require('yelp-fusion');

const token = "s218sdHs0ABqZfHcMMzW3JvZ1NTXmNpI5K39l0LBmGdq9sQnlt5mlJNh4UOUMe0ZQsZCPEGOl4neJTyxDWsezhcmEmfepi7sIGiLasjV9KkGyncefvRMHiWtXMFNYnYx";

// Route    GET api/yelp/search
// desc     request the yelp api for a result based on the user input
// Access   Public
router.post("/", 
    (request, response) => {
        try {
            const client = yelp.client(token);
            client.search(request.body)
                .then(yelpData => {
                    return response.status(200).json(JSON.parse(yelpData.body).businesses);
                })
                .catch((error) => {
                    console.log(error.response.body);
                });
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        };
});
// Export user api
module.exports = router;