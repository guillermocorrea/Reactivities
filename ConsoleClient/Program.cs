// using System;
// using System.Text;
// using System.Linq;

// namespace ConsoleClient
// {
//     public class Program
//     {
//         static int jumpingOnClouds(int[] c)
//         {
//             var sb = new StringBuilder("");
//             int numberOfJumps = 0;
//             for (var i = 0; i < c.Length - 1; i++)
//             {
//                 if (i + 2 < c.Length && c[i + 2] == 0)
//                 {
//                     i += 1;
//                 }
//                 numberOfJumps++;
//             }
//             return numberOfJumps;
//         }

//         static long repeatedString(string s, long n)
//         {
//             decimal div = (decimal)n / (decimal)s.Length;
//             var iterations = Math.Ceiling(div);
//             var totalCharacters = iterations * s.Length;
//             bool shouldBeTruncated = totalCharacters > n;
//             var occurrences = s.Count(c => c == 'a');
//             if (shouldBeTruncated) {
//                 var result = (iterations - 1) * occurrences;
//                 var diff = totalCharacters - n;
//                 var newStr = s.Substring(0, s.Length - (int)diff);
//                 return (long)(result + newStr.Count(c => c == 'a'));
//             } else {
//                 return (long)(iterations * occurrences);
//             }
//         }

//         static void Main(string[] args)
//         {
//             // Console.WriteLine(jumpingOnClouds(new int[] { 0, 0, 0, 1, 0, 0 }));
//             Console.WriteLine(repeatedString("aba", 10));
//         }
//     }
// }

using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

namespace ConsoleClient
{
    public class Program
    {

        // Complete the hourglassSum function below.
        static int hourglassSum(int[][] arr)
        {
            int sum = 0;
            int highest = 0;
            for (int i = 0; i < 4; i++)
            {
                for (int j = 0; i < 4; j++)
                {
                    sum = arr[i][j] + arr[i + 1][j] + arr[i + 2][j] +
                          arr[i + 1][j + 1] +
                          arr[i][j + 2] + arr[i + 1][j + 2] + arr[i + 2][j + 2];
                    Console.WriteLine(sum);
                    highest = sum > highest ? sum : highest;
                }
            }
            Console.Wr
            return highest;
            /*
            1 1 1 0 0 0
            0 1 0 0 0 0
            1 1 1 0 0 0
            0 0 2 4 4 0
            0 0 0 2 0 0
            0 0 1 2 4 0
            */
        }

        static void Main(string[] args)
        {
            // TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

            int[][] arr = new int[6][];

            for (int i = 0; i < 6; i++)
            {
                arr[i] = new int[] { 0, 0, 0, 0, 0, 0 };
            }

            int result = hourglassSum(arr);

            // textWriter.WriteLine(result);

            // textWriter.Flush();
            // textWriter.Close();
        }
    }
}