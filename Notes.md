https://codepen.io/coreydd2002/pen/BagXLrP


CSS:
Media queries: act like if statements
Padding: "the amount of space around a text box that separates the text from the other content"
Margin: "the amount of space between the sections" (this can be done in em or px for units
Border radius: "determines the roundness on the corners of a section"
border-bottom: "this will add a divider line across the section (it can be manipulated with words such as solid white thin)"
font-weight: "font boldness (doesn’t require a unit, just a number)"
list-style: "this determines the type of bullet points (ex: square)

#table-data {
  background-color: #eee;
  width: 300px;
} 
td,
th {
  color: black;
  text-align: center;
  border: black solid thin;
  padding: 1em;
} "example of how to manipulate the table 

.fly-in {  <<"this is the funciton definition"
  animation: fly-from-left 1s ease-out; "animation will allow you to manipulate the page to move with what ever directions you give"
}

@keyframes fly-from-left { <<"this defines the derections for the above"
  0% { "start of the animation
    transform: translateX(-200%); "where the content will be at the start
  }
  100% { "end of animation"
    transform: translateX(0%); "where it will end"
  }
}![image](https://github.com/user-attachments/assets/ca466385-5750-4bc6-a947-c6c617deaa38)
