from dataclasses import dataclass, asdict
from typing import Optional, List
from datetime import datetime

@dataclass
class User:
    bits_id: str  # Unique user identifier (MongoDB's _id format)
    username: str
    email: str
    password_hash: str
    contact_number: str
    role: str  # "student" or "admin"
    registration_date: datetime = datetime.now()
    room_number: Optional[str] = None  # Reference to an Allotment entry if allocated
    hostel_name: Optional[str] = None  # Reference to an Allotment entry if allocated

    def to_dict(self) -> dict:
        user_dict = asdict(self)
        user_dict["registration_date"] = self.registration_date.isoformat()
        return user_dict

@dataclass
class Room:
    hostel_name: str  # Reference to the hostel
    room_number: str
    type: str  # "single", "double", "triple", etc.
    capacity: int
    current_occupancy: int = 0
    occupants: List[str] = None  # List of user IDs of occupants
    features: Optional[List[str]] = None  # List of room-specific features

    def to_dict(self) -> dict:
        return asdict(self)

@dataclass
class Allotment:
    _id: str  # Unique allotment identifier (MongoDB's _id format)
    user_id: str  # Reference to the user
    room_id: str  # Reference to the room
    hostel_id: str  # Reference to the hostel
    allotment_date: datetime
    duration: str  # e.g., "1_year"
    status: str  # "active", "vacated", etc.
    remarks: Optional[str] = None

    def to_dict(self) -> dict:
        allotment_dict = asdict(self)
        allotment_dict["allotment_date"] = self.allotment_date.isoformat()
        return allotment_dict

@dataclass
class Hostel:
    hostel_name: str
    location: str
    total_rooms: int
    capacity: int
    current_occupancy: int = 0
    rooms: List[str] = None  # List of room IDs associated with the hostel
    warden_contact: Optional[str] = None
    warden_name: Optional[str] = None
    warden_email: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)

@dataclass
class Application:
    _id: str  # Unique application identifier (MongoDB's _id format)
    bits_id: str  # Reference to the user
    hostel_preference: List[str]  # List of preferred hostel IDs
    room_type_preference: str  # Preferred room type (e.g., "single", "double")
    application_date: datetime
    hostel_status: str  # "pending", "approved", "rejected"
    room_status: str  # "pending", "approved", "rejected"
    alloted_hostel: Optional[str] = None
    alloted_room: Optional[str] = None
    remarks: Optional[str] = None

    def to_dict(self) -> dict:
        application_dict = asdict(self)
        application_dict["application_date"] = self.application_date.isoformat()
        return application_dict


# Define the list of hostels as instances of the Hostel dataclass
hostels_data = [
    Hostel(
        hostel_name="Hostel A",
        location="East Wing",
        total_rooms=3,
        capacity=6,
        # current_occupancy=0,
        rooms=["101", "102", "103"],
        # warden_contact="123-456-7890",
        # warden_name="John Doe"
    ),
    Hostel(
        hostel_name="Hostel B",
        location="West Wing",
        total_rooms=4,
        capacity=8,
        # current_occupancy=0,
        rooms=["201", "202", "203", "204"],
        # warden_contact="234-567-8901",
        # warden_name="Jane Smith"
    ),
    Hostel(
        hostel_name="Hostel C",
        location="North Wing",
        total_rooms=2,
        capacity=4,
        # current_occupancy=0,
        rooms=["301", "302"],
        # warden_contact="345-678-9012",
        # warden_name="Alice Johnson"
    ),
]

rooms_data = [
    Room(
    hostel_name="Hostel A",
    room_number="101",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel A",
    room_number="102",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel A",
    room_number="103",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel B",
    room_number="201",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel B",
    room_number="202",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel B",
    room_number="203",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel B",
    room_number="204",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel C",
    room_number="301",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    ),
    Room(
    hostel_name="Hostel C",
    room_number="302",
    type="single",
    capacity=1
    # current_occupancy: int = 0
    )
]