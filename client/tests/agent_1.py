from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

from ai_trace.trace_crewai import view_crew


# os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY"
# openai.api_key = st.secrets["OPEN_API_KEY"]

@tool('DuckDuckGoSearch')
def search(search_query: str):
    """Search the web for information on a given topic"""
    return DuckDuckGoSearchRun().run(search_query)


@tool("Custom Tool")
def custom_tool(query: str):
    """A custom tool that returns the input as is"""
    return query


def create_travel_crew(destination):
    # Define Agents
    travel_advisor = Agent(
        role="Travel Advisor",  # Changed from Expert Travel Agent
        goal=f"Craft a personalized itinerary for a trip based on your preferences.",
        backstory="A seasoned globetrotter, passionate about creating unforgettable travel experiences!",
        verbose=True,
        allow_delegation=True,
        tools=[search, custom_tool],
        llm="gpt-3.5-turbo"
    )

    city_explorer = Agent(  # New agent - City Explorer
        role="City Explorer",  # New role
        goal=f"Explore potential destinations and suggest exciting cities based on your interests.",
        backstory="An expert in uncovering hidden travel gems, ready to find the perfect city for your trip!",
        verbose=True,
        allow_delegation=True,
        tools=[search],
        llm="gpt-3.5-turbo"
    )

    activity_scout = Agent(
        role="Activity Scout",
        goal=f"Find exciting activities and attractions in {destination} that match your interests.",
        backstory="An expert curator of unique experiences, ready to unveil the hidden gems of {destination}.",
        verbose=True,
        allow_delegation=True,
        tools=[search],
        llm="gpt-3.5-turbo"
    )

    logistics_coordinator = Agent(
        role="Logistics Coordinator",
        goal=f"Help you navigate the logistics of your trip to {destination}, including flights, accommodation, and transportation.",
        backstory="A logistical whiz, ensuring your trip runs smoothly from start to finish.",
        verbose=True,
        allow_delegation=True,
        tools=[search],
        llm="gpt-3.5-turbo"
    )

    # Define Tasks (modified based on new agent)
    # Task 1 can use either travel_advisor or city_explorer depending on user input
    if destination:
        task1 = Task(
            description=f"Plan a personalized itinerary for a trip to {destination}. Consider preferences like travel style (adventure, relaxation, etc.), budget, and desired activities.",
            expected_output="Personalized itinerary for a trip to {destination}.",
            agent=travel_advisor,
        )
    else:
        task1 = Task(
            description=f"Help you explore potential destinations and suggest exciting cities to visit based on your interests (e.g., beaches, culture, nightlife).",
            expected_output="List of recommended destinations and interesting cities to visit.",
            agent=city_explorer,
        )

    task2 = Task(
        description=f"Find exciting activities and attractions in {destination} that align with your preferences (e.g., museums, hiking, nightlife).",
        expected_output="List of recommended activities and attractions in {destination}.",
        agent=activity_scout,
    )

    task3 = Task(
        description=f"Help you navigate the logistics of your trip to {destination}. Search for flights, accommodation options, and local transportation based on your preferences and itinerary.",
        expected_output="Recommendations for flights, accommodation, and transportation for your trip to {destination}.",
        agent=logistics_coordinator,
    )

    # Create and Run the Crew
    travel_crew = Crew(
        name="Travel Crew",
        agents=[travel_advisor, activity_scout, logistics_coordinator],
        tasks=[task1, task2, task3],
        process=Process.sequential,
    )

    view_crew(travel_crew)
    return None


create_travel_crew("New York City")
