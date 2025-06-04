// // "use client";

// // import React, {
// //   forwardRef,
// //   useCallback,
// //   useRef,
// //   useImperativeHandle,
// // } from "react";
// // import ReactCanvasConfetti from "react-canvas-confetti";

// // type ConfettiCannonProps = {};

// // export interface ConfettiCannonHandles {
// //   shoot: () => void;
// // }

// // export const ConfettiCannon = forwardRef<
// //   ConfettiCannonHandles,
// //   ConfettiCannonProps
// // >((_, ref) => {
// //   const confettiInstance = useRef<any>(null);

// //   // Grab the confetti instance:
// //   const getInstance = useCallback((instance: any) => {
// //     confettiInstance.current = instance;
// //   }, []);

// //   // Expose a "shoot" method to the parent:
// //   useImperativeHandle(ref, () => ({
// //     shoot: () => {
// //       if (confettiInstance.current) {
// //         // This is where you customize the explosion
// //         confettiInstance.current({
// //           particleCount: 200,
// //           spread: 120,
// //           origin: { y: 0.6 },
// //           // Set your custom colors here
// //           colors: ["#000000", "#FF1493", "#FFFFFF"],
// //         });
// //       }
// //     },
// //   }));

// //   return (
// //     <ReactCanvasConfetti
// //       refConfetti={getInstance}
// //       style={{
// //         position: "fixed",
// //         pointerEvents: "none",
// //         width: "100%",
// //         height: "100%",
// //         top: 0,
// //         left: 0,
// //       }}
// //     />
// //   );
// // });

// // ConfettiCannon.displayName = "ConfettiCannon";

// "use client";

// import React, {
//   forwardRef,
//   useCallback,
//   useRef,
//   useImperativeHandle,
// } from "react";
// import ReactCanvasConfetti from "react-canvas-confetti";

// export interface ConfettiCannonHandles {
//   shoot: () => void;
// }

// export const ConfettiCannon = forwardRef<ConfettiCannonHandles>((_, ref) => {
//   const confettiInstance = useRef<any>(null);

//   const getInstance = useCallback((instance: any) => {
//     confettiInstance.current = instance;
//   }, []);

//   useImperativeHandle(ref, () => ({
//     shoot: () => {
//       if (confettiInstance.current) {
//         confettiInstance.current(); // Simplified call with default settings
//       }
//     },
//   }));

//   return (
//     <ReactCanvasConfetti
//       refConfetti={getInstance}
//       style={{
//         position: "fixed",
//         pointerEvents: "none",
//         width: "100%",
//         height: "100%",
//         top: 0,
//         left: 0,
//       }}
//     />
//   );
// });

// ConfettiCannon.displayName = "ConfettiCannon";
