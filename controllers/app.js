const musabaqaModel = require('../database/musabaqaModel')
const quizModel = require('../database/quiz')
const batch = new Date().getFullYear()
module.exports = {
    dashboard:async(req,res)=>{
        const totalQuiz = await quizModel.countDocuments({
            school:req.user._id,
            batch,        
          });
          console.log(totalQuiz)
        const students = await musabaqaModel.find({school:req.user._id});
       var uniqueCategories;
        if(students){
            // Use reduce to create an array with unique categories
    uniqueCategories = students.reduce((acc, curr) => {
    // Check if the category already exists in the accumulator
    if (!acc.some(item => item.category === curr.category)) {
      acc.push(curr);
    }
    return acc;
  }, []);
  
  var registeredCategories = students ? uniqueCategories.length : 0
        }
        res.render('pages/dashboard',{
             name:req.user.name,
             categories:registeredCategories,
            totalStudents: students ? (students.length + totalQuiz) : 0})

    },
    application:async(req,res)=>{
        const {name,dob,riwaya,description, category} = req.body;
        if(!name || !dob || !riwaya || !description || !category)
            return res.render('pages/application', {error:true, msg:'please fill all the fields'})
        // return res.json({status:401, msg:'please fill all the fields'})
        const categoryAdded = await musabaqaModel.countDocuments({
            school:req.user._id,
            batch,        
            category
          });
        if(categoryAdded == 2 )
            return res.render('pages/application',{error:true, msg:'maximum number of applicants is reached'})
            // return res.json({msg:'maximum number of applicants is reached'})
        const newStudent = new musabaqaModel({
            name,
            dob,
            riwaya,
            description,
            category,
            schoolName:req.user.name,
            school:req.user._id,
            batch

        })

        const savedStudent = await newStudent.save();
        if(!savedStudent)
            // return res.json({status:401, msg:'unable to add participant'})
            return res.render('pages/application', {error:true, msg:'error while addig participant'})
            // res.json({status:401, msg:'participant added successfully'})
            res.render('pages/application', {error:true, msg:'participant added successfully'})
    },
    participants:async(req,res)=>{
        const musabaqa =await musabaqaModel.find({school:req.user._id, batch}).sort({hizb:1})
        const quiz = await quizModel.find({school:req.user._id, batch})
        // res.json({status:200, participants:musabaqa})
        // console.log(musabaqa,quiz)
        res.render('pages/document',{musabaqa,quiz, error:false})
    },
    quiz:async(req,res)=>{
        const {name,dob} = req.body;
        if(!name || !dob)
            return res.render('pages/hadith',{error:true, msg:"please fill all fields"})
        const newStudent = new quizModel({
            schoolName:req.user._id,
            school:req.user._id,
            name,
            dob,
            batch
        })

        const savedStudent = await newStudent.save();
        if(!savedStudent)
            // return res.json({status:401, msg:'unable to add participant'})
            return res.render('pages/hadith', {error:true, msg:'error while addig participant'})
            // res.json({status:401, msg:'participant added successfully'})
            res.render('pages/hadith', {error:true, msg:'participant added successfully'})
    },
    editApplication: async(req,res)=> {
        const musabaqa =await musabaqaModel.find({school:req.user._id, batch}).sort({hizb:1})
            const quiz = await quizModel.find({school:req.user._id, batch})
        const id = req.params.id;
        const student = await musabaqaModel.findById(id)
        if(!student)
            return res.render('/app/document',{error:true, msg:"something went wrong", musabaqa, quiz} )
        res.render('pages/edit',{error:false, msg:'', student}

        )},
        edithApplication: async(req,res)=> {
            const musabaqa =await musabaqaModel.find({school:req.user._id, batch}).sort({hizb:1})
            const quiz = await quizModel.find({school:req.user._id, batch})
        const id = req.params.id;
        const student = await quizModel.findById(id)
        if(!student)
            return res.render('/app/document',{error:true, msg:"something went wrong", musabaqa, quiz} )
        res.render('pages/edith',{error:false, msg:'', student}

        )},
        edit:async(req,res)=>{
            const musabaqa =await musabaqaModel.find({school:req.user._id, batch}).sort({hizb:1})
            const quiz = await quizModel.find({school:req.user._id, batch})
            const {name,dob,riwaya,description, category} = req.body;
            const id = req.params.id
            if(!name || !dob || !riwaya || !description || !category|| !id)
                return res.render('pages/document', 
            {error:true, msg:`unable to edit participant`,
            musabaqa, quiz
            })
            const updatedUser = await musabaqaModel.findByIdAndUpdate(
                id,
                { $set: { name,dob,riwaya,description, category} },
                { new: true }
              );

              if(!updatedUser)
                return res.render('pages/document', 
               {error:true, msg:`unable to edit participant`, musabaqa, quiz})
                res.render('pages/document', {error:true, msg:`participant successfully updated`,
                musabaqa, quiz})
        },
        edith:async(req,res)=>{
            const musabaqa =await musabaqaModel.find({school:req.user._id, batch}).sort({hizb:1})
            const quiz = await quizModel.find({school:req.user._id, batch})
            const {name,dob} = req.body;
            const id = req.params.id
            if(!name || !dob || !id)
                return res.render('pages/document', {error:true, msg:`unable to edit participant`, musabaqa, quiz})
            const updatedUser = await quizModel.findByIdAndUpdate(
                id,
                { $set: { name,dob} },
                { new: true }
              );

              if(!updatedUser)
                return res.render('pages/document', {error:true, msg:`unable to edit participant`, musabaqa, quiz})
                res.render('pages/document', 
                {error:true, msg:`participant successfully updated`,musabaqa, quiz })
        },
        pay:(req,res)=>{
            res.send("hi payment")
        }
}