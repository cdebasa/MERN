const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//@Routes     Get api/profile/me
//@des       Get Current Users profile
//@access     Private
router.get("/me", auth, async (req, res) => {
  //do try and catch
  try {
    //get back our own profile
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    //check to see if the profile exists
    if (!profile) {
      return res.status(400).json({
        msg: "there is no profile for this user"
      });
    }
    //then send the profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@Routes     Post api/profile
//@des        Create or update a user profile
//@access     Private

router.post(
  "/",
  [
    auth,
    [
      //check for status to be empty
      check("status", "Status is required")
        .not()
        .isEmpty(),
      //check for skills to be empty
      check("skills", "Skill is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //check for errors
    const errors = validationResult(req);
    //And then check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    //Pull everything from the body Destructure
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    //check if the fields are there
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    //turn skills into array
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //now we insert the data
    try {
      //get the user
      let profile = await Profile.findOne({
        user: req.user.id
      });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        //return profile if found
        return res.json(profile);
      }
      //create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@Routes     GET api/profile
//@des        Get all Profiles
//@access     Private

router.get("/", async (req, res) => {
  try {
    //get all profiles with theier avatars and send back
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@Routes     GET api/profile/user/:user_id
//@des        Get profile by user ID
//@access     Public sec4 lec18/ get profiles by userID
//Work on this
router.get("/user/:user_id", async (req, res) => {
  try {
    //get all profiles with theier avatars and send back
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({
        msg: "there is no profile forassta this user"
      });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//@Routes     GET api/profile
//@des        delete profile user and post
//@access     Private

router.delete("/", auth, async (req, res) => {
  try {
    //@todo - remove user posts
    //remove profile
    await Profile.findAndRemove({ user: req.params.user });
    await User.findAndRemove({ _id: req.params.user });
    //remove user

    res.json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@Routes     Put api/profile/experience
//@des        Add profile experience
//@access     Private

router.put(
  "/experience",
  [
    auth,
    [
      check("titile", "title is required")
        .not()
        .isEmpty(),
      check("company", "company is required")
        .not()
        .isEmpty(),
      check("from", "date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      //profile to add experience 2
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).send("no profile found");
      }
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).server("error");
    }
  }
);
//@Routes     Delete api/profile/experience/:exp_id
//@des        Delete profile experience
//@access     Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //get profile
    const profile = await Profile.findOne({ user: req.user.id });
    //get the correct experience to remove
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex < 0) {
      return res.status(404).json({
        msg: "Experience not found"
      });
    }

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.msg);
    return res.status(500).send("server error");
  }
});
//@Routes     Add api/profile/education/
//@des        add an education bracket
//@access     Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(400).json({
        errors: errors.array()
      });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      //profile to add experience 2
      const profile = await Profile.findOne({
        user: req.user.id
      });
      if (!profile) {
        return res.status(400).send("no profile found");
      }
      profile.education.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).server("error");
    }
  }
);

//@Routes     Delete api/profile/education/:ed_id
//@des        Delete education
//@access     Private
router.delete("/education/:ed_id", auth, async (req, res) => {
  try {
    //get profile
    const profile = await Profile.findOne({ user: req.user.id });
    //get the correct experience to remove
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.ed_id);

    if (removeIndex < 0) {
      return res.status(404).json({
        msg: "Education not found"
      });
    }
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.msg);
    return res.status(500).send("server error");
  }
});
module.exports = router;
