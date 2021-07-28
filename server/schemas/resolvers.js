const {AuthenticationError} = require('appolo-server-express')
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
        }
    }
}