### What is the difference between Component and PureComponent? give an example where it might break my app.

Similar to pure functions, pure components are designed to only change its output only if its inputs or state changes, thus it comes with a default ShouldComponentUpdate implementation that does **shallow** comparison between previous and current props and state compared to the default behavor of `Component` that re-renders the component whenever ShouldComponentUpdate is called (unless of course it is overwritten)

this can cause the app to break in case we are updating our props/state without paying attention to immutability where we could update a certain property of a prop expecting the component to re-render but since its refrenece never changed, it will not

---

### Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

The way the Context API is implemented is to re-render the children of the context provider whenever the provider value changes **regardless** of what ShouldComponentUpdate results in, this can cause some unpredictable behavior where we would expect a component not to update because ShouldComponentUpdate returns false

---

### Describe 3 ways to pass information from a component to its PARENT.

- by passing a setter prop that the child can invoke whenever it wants to pass information to the parent (usually the best and most commonly used approach)
- using a centralized state (a context or a redux store) the child can update the values of the state which the parent would subscribe to (best approach if the child isn't a direct child of the parent we want to notify or if we are planning on using these information across multiple components)
- by defining a function that returns these information and adding it to the child's ref object using `useImperativeHandle` hook or directly in case of class components (quite unconventional and i personally wouldn't recommend it)

---

### Give 2 ways to prevent components from re-rendering

- for class components overriding ShouldComponentUpdate to return false whenever we don't want the component to re-render
- using useMemo will allows us to memoize a certain component and only re-render it based on the dependencies we pass for example

```jsx
const [dep, setDep] = useState(false);

const myMeomizedChild = useMemo(() => <MyChild />, [dep]);
const reRenderChild = () => setDep(!!dep);

return (
  <div>
    <p> Any other children </p>
    {myMeomizedChild}
  </div>
);
```

in this example `MyChild` will be rendered and cached into `myMeomizedChild` this cached version is controlled by the `dep` dependency allowing us to control re-rendering it by changing `dep` (by calling reRenderChild function for example)

these two examples describe how we can **force** disabling re-renders and should be used only in cases where they are needed, if our goal however is to optimize rendering and avoid unnecessary re-renders, we should resort to using `PureComponents` or `React.Memo`

---

### What is a fragment and why do we need it? Give an example where it might break my app.

Duo to the nature of JSX and how it is compiled to `React.createElement` calls, a react component must return a single parent element, this resulted in a lot of cases where we would put a wrapper just for the purpose of getting around this limitation resulting in unnecessary elements being rendered to the DOM, or in some cases even adding limitations (for example when we have a component that is supposed to render `li` items inside a `ul` where we want it to return the list items wihtout a wrapper)

this is where fragments come to play, it allows us to return multiple elements from a single component without needing an additional wrapper to the DOM

the drawback i can think of when it comes to the use of fragments i believe they shouldn't be the default go to when talking about custom independent components as an independent component should be treated as a stand alone element and doesn't rely on its rendering context (should display the same regardless of where it is used)

a problem that using fragments could lead to is with predictability when using components

assuming that we have the next two components

### Child

```jsx
const Child = () => (
  <>
    <div> first element</div>
    <div> second element</div>
    <div> third element</div>
  </>
);
```

### Parent

```jsx
const Parent = () => (
  <div style="display:flex; justify-content:space-between">
    <Child />
    <button> my button</button>
  </div>
);
```

one might expect that the three elements inside `Child` will be grouped together and the space will be divided between them and the button however that's not the case and it will be divided between all 4 elements

---

### Give 3 examples of the HOC pattern.

Based on the high order functions principle from functional programming, higher order components is a pattern that allows us to extend the basic functionality/definition of components

this pattern can be seen everywhere in the react eco system some examples are

- the `connect` higher order component from `redux`, that allows us to attach state and actions to props to be passed to a component
- the `withRouter` higher order component from `react-router` that allows us to pass router related props (like history and location) to a component
- the `withTranslation ` higher order component from `react-i18next` which allows us to pass the translation function to a component to be used for translations

other use cases to use higher order components can be

- permissions handling where we check users permissions before allowing them into a page, and if they are unauthorized redirect them properly
- presentation related functionality, for example if we want to display a component as an overlay, we can create a HOC that wraps a component with certain mark up to be displayed as such
- another usecase is handling uncaught exceptions where we can wrap a component in a HOC that wraps it in an error boundry and display a general error layout in case of an error

---

### what's the difference in handling exceptions in promises, callbacks and async...await.

- using promises you get access to `catch` handler that is passed the thrown error for you to gracefully handle it in case of an uncaught exception or a promise rejections, this handler is different that the resolve case handler passed to a `then` handler, what makes this better than callback approach is that it also catches any uncaught exceptions inside your `then` handler(s)
- for callbacks both errors and results are passed to the **same** callback, with errors being the first argument by convention and within the same handler you are supposed to handle both, this doesn't give you the ability to to catch exceptions caused by your success logic and might require you to manually catch exceptions and duplicate the error handling logic
- with async...await, you have complete control over the flow of your code, where you would wrap you async...await code in try catch blocks and determine if you would like to continue the code execution (by subsituting a default value for example) or return an error state

---

### How many arguments does setState take and why is it async

`setState` takes two arguments

- the state to be updated
- a callback to be executed after the state has been updated

  the reason setState is async is mainly for batching purposes where multiple setState calls can be batched and applied together resulting in better performance since updating state results in re-renders it minimizes unnecessary re-renders

---

### List the steps needed to migrate a Class to Function Component.

when migrating a class component to a function component the things to take care of are

- Migrating and updating state and taking decisions related to them, for example breaking down the state into multiple useState calls
- Migrating life cycle logic which would include going through the different life cycle hooks and replacing them with the appropriate hooks/handlers to keep the same behavior
- checking if any class inheritence is used, some components might be inheriting a parent base component in which they render the same, but the underlying functionality might be a bit different, this needs to be refactored into HOC for example

---

### List a few ways styles can be used with components.

Styling in the react eco system is a bit of an opinionated open topic, the main concern in this topic is style encapsulation and how to prevent styles from bleeding in/out of our components,here are some common approaches

- CSS-in-JS: by using a 3rd party library like `styled-components` we can create `styled` variants of our components where styles are added and scoped to our components by generating a unique css class

```jsx
const Wrapper = styled.div`
  width: 200px;
  height: 200px;
`;
const Comp = () => <Wrapper>My Content</Wrapper>;
```

- CSS modules: allows us to import stylesheets as objects and assign appropriate class names from them

```jsx
import styles from "./style.css";

const comp = () => <div className={styles.myDiv}>My Content</div>;
```

- using a css architecture methedology (like BEM): although the least safe, it is still considered a good approach for organizing styles, especially if creating a component library that will have multiple implementations in different frameworks

```jsx
const comp = () => (
  <div className="wrapper">
    <p className="wrapper__content">My Content</p>
  </div>
);
```

---

### How to render an HTML string coming from the server.

by using `dangerouslySetInnerHTML` and passing it an object with \_\_html peroperty containing our HTML string we can achieve this, however this puts us in the risk of cross site scripting attacks and therefore it is a good idea to make sure that this content is sanitized first doing so (dompurify is a good library for doing so)
