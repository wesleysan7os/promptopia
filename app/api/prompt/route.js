import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const GET = async (request) => {
    try {
        await connectToDB();

        const userInput = request.nextUrl.searchParams.get(['filter']);

        if (!userInput) {
            const prompts = await Prompt.find({}).populate('creator');
            return new Response(JSON.stringify(prompts), { status: 200 });
        }

        let query = {
            $or: [
              { prompt: { $regex: userInput, $options: 'i' } }, // Case-insensitive prompt match
              { tag: { $regex: userInput, $options: 'i' } }, // Case-insensitive tag match
            ],
        };

        const promptMatches = await Prompt.find(query).populate('creator').lean();
        const creators = await User.find(
            { username: { $regex: userInput, $options: 'i'} },  // Case-insensitive username match
            {_id: 1}
        ).lean();
        
        const creatorsIds = creators.map(creator => creator._id.toString());
        let creatorsMatches = [];

        if (creatorsIds.length)
          creatorsMatches = await Prompt.find({ creators: {$in: creatorsIds}}).populate('creator').lean();
        
        const combinedResults = [...promptMatches, ...creatorsMatches];
        
        if (combinedResults.length) {
          // Using Set to remove duplicates based on the _id property
          const uniqueResults = Array.from(new Set(combinedResults.map(result => result._id.toString())))
            .map(_id => combinedResults.find(result => result._id.toString() === _id));
            
          if (uniqueResults.length) {
            return new Response(JSON.stringify(uniqueResults), { status: 200 });
          }
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response('Failed to fetch all prompts', { status: 500 })
    }
}