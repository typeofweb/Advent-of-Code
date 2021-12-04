module Main where

(|>) x f = f x

solve1 content =
  nums
    |> zipWith (-) (drop 3 nums)
    |> filter (0 >)
    |> length
  where
    nums = content |> lines |> map read

main =
  do
    readFile "./input1"
    >>= print . solve1
