import { PodcastSelect } from "@/components/podcast/podcast-select";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  // const { podcast } = usePodcast();

  // if (!podcast) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <PodcastSelect />
    </div>
  );
  // }

  // return (
  //   <div className="w-full h-full flex flex-col min-h-0 p-8 gap-8">
  //     <div className="bg-accent w-72 h-72 aspect-square rounded-lg mx-auto p-2">
  //       Upload a podcast or select one in library to get started
  //     </div>
  //     <div className="flex-1 flex-col"></div>
  //   </div>
  // );
}

// const FileSide = () => {
//   const { fileMetadata, file, filePath, loadFile, isLoaded, fileHash } =
//     useFile();

//   const onSelect = async (filePath: string | null) => {
//     if (!filePath) return;

//     await loadFile(filePath);
//   };

//   useEffect(() => {
//     if (!fileHash) return;

//     const dbLookup = async () => {
//       // check if file already exists in database
//       console.log({ fileHash });

//       // save filePath, Metadata & file hash in database
//       await db.insert(filesSchema).values({
//         filePath,
//         fileHash,
//       });
//     };
//     dbLookup();
//   }, [fileHash]);

//   if (!filePath) {
//     return (
//       <div className="flex gap-2 flex-col items-center">
//         <p className="font-semibold">Select your podcast to get started</p>
//         <FileButton onSelect={onSelect} />
//       </div>
//     );
//   }

//   if (!file) {
//     return (
//       <div className="flex items-center gap-2 justify-center">
//         <LoaderIcon
//           size={18}
//           className="animate-spin [animation-duration:2s]"
//         />
//         Loading file...
//         {isLoaded}
//       </div>
//     );
//   }

//   const speechToText = async () => {
//     const res = await SpeechToText(file);
//     console.log({ res });
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       {/* {metadata && <AudioMetadata metadata={metadata} filePath={filePath} />} */}

//       <Button onClick={() => speechToText()}>Queue Speech to Text</Button>
//     </div>
//   );
// };

// const AudioMetadata: React.FC<{
//   metadata: IAudioMetadata;
//   filePath: string;
// }> = ({ metadata, filePath }) => {
//   return (
//     <div className="text-sm flex gap-2 flex-col">
//       <p>{metadata.common.title ? metadata.common.title : filePath}</p>
//       {metadata.common.album && (
//         <div className="flex gap-1 items-center">
//           <p>
//             <span className="font-semibold">Album:</span>{" "}
//             {metadata.common.album}
//           </p>
//         </div>
//       )}

//       {metadata.common.genre && (
//         <div className="flex gap-1 items-center">
//           <p className="font-semibold">Genre</p>
//           {metadata.common.genre.map((genre) => (
//             <Badge>{genre}</Badge>
//           ))}
//         </div>
//       )}

//       {metadata.common.year && (
//         <div className="flex gap-1 items-center">
//           <p className="font-semibold">Year</p>
//           <Badge>{metadata.common.year}</Badge>
//         </div>
//       )}

//       {metadata.common.comment && (
//         <div className="flex gap-1 items-center">
//           {metadata.common.comment.map((comment) => (
//             <p key={comment.text} className="text-sm">
//               {comment.text}
//             </p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // const AudioImage: React.FC<{data: Uint8Array}> = ({data}) => {
// //   return (

// //   )
// // }
