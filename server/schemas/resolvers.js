const {AuthenticationError} = require('apollo-server-express')
const {User} = require('../models');
const {signToken} = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context)=>{
            if(context.user){
                const user = await User.findOne(
                {
                    _id: context.username
                }
                ).select("-password")
                return user;
            }
            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args, context) => {
            const user = User.create(args);
            const token = signToken(user);
            return {user, token };
        },

        login: async (parent, args, context)=>{
                const user = User.findOne({email});
                if (!user) {
                    throw new AuthenticationError('Incorrect credentials');
                  }
            
                  const correctPw = await user.isCorrectPassword(password);
            
                  if (!correctPw) {
                    throw new AuthenticationError('Incorrect credentials');
                  }
            
                  const token = signToken(user);
                  return { token, user };
                },
        saveBook: async (parent, { bookData }, context) => {
                    if (context.user) {
                      console.log(context.user)
                      const updatedUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $push: { savedBooks: bookData } },
                        { new: true }
                      );
              
                      return updatedUser;
                    }
              
                    throw new AuthenticationError('You need to be logged in!');
                  },
        removeBook: async (parent, { bookId }, context) => {
                    if (context.user) {
                      const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId } } },
                        { new: true }
                      );
              
                      return updatedUser;
                    }
              
                    throw new AuthenticationError('You need to be logged in!');
                  },
        }
    }


    module.exports = resolvers;