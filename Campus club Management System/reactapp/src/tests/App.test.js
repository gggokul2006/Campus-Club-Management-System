import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock components (replace these imports with your actual component paths)
import ClubForm from '../components/ClubForm';
import ClubList from '../components/ClubList';
import Header from '../components/Header';
import App from '../App';
import * as api from '../services/api';

// Setup mocks
jest.mock('../services/api', () => ({
  addClub: jest.fn(),
  updateClub: jest.fn(),
  getClubById: jest.fn(),
  deleteClub: jest.fn(),
  getAllClubs: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Setup window mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Helper functions
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Create a version of App without Router for testing
const AppWithoutRouter = () => {
  const [clubs, setClubs] = React.useState([]);
  const [error, setError] = React.useState("");

  const fetchClubs = async () => {
    try {
      const data = await api.getAllClubs();
      setClubs(data || []);
    } catch (err) {
      setError("Failed to fetch clubs.");
    }
  };

  React.useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <div className="app-root">
      <Header />
      <main className="container">
        {error && <div className="error">{error}</div>}
        <ClubList clubs={clubs} onChange={fetchClubs} />
        <ClubForm onAdd={fetchClubs} setError={setError} />
      </main>
    </div>
  );
};

// Mock data
const mockClubs = [
  {
    id: 1,
    clubName: 'Computer Science Club',
    category: 'Technical',
    description: 'A club for computer science enthusiasts to learn and grow together',
    presidentEmail: 'president@csclub.com',
    memberCount: 45,
    establishedDate: '2022-09-15',
    status: 'Active'
  },
  {
    id: 2,
    clubName: 'Basketball Club',
    category: 'Sports',
    description: 'Promoting basketball and healthy competition among students',
    presidentEmail: 'captain@basketball.com',
    memberCount: 30,
    establishedDate: '2021-08-20',
    status: 'Inactive'
  },
  {
    id: 3,
    clubName: 'Drama Society',
    category: 'Cultural',
    description: 'Bringing theatrical arts and performances to campus life',
    presidentEmail: 'director@drama.com',
    memberCount: 25,
    establishedDate: '2023-01-10',
    status: 'Under Review'
  }
];

// ============================================================================
// HEADER COMPONENT TESTS
// ============================================================================
describe('Header Component', () => {
  test('renders title', () => {
    render(<Header />);
    expect(screen.getByText('Campus Club Management System')).toBeInTheDocument();
  });

 
});

// ============================================================================
// CLUB FORM COMPONENT TESTS
// ============================================================================
describe('ClubForm Component', () => {
  const mockOnAdd = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders add club form', () => {
    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} />);
    
    expect(screen.getByPlaceholderText('Club name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('President email')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Academic')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Member count')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Established date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Club description and activities...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Active')).toBeInTheDocument();
    expect(screen.getByText('Add Club')).toBeInTheDocument();
  });

  test('submits new club successfully', async () => {
    api.addClub.mockResolvedValueOnce();
  
    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} />);
  
    // Fill out the form using fireEvent instead of userEvent
    fireEvent.change(screen.getByPlaceholderText('Club name'), { target: { value: 'Test Club' } });
    fireEvent.change(screen.getByPlaceholderText('President email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByDisplayValue('Academic'), { target: { value: 'Sports' } });
    fireEvent.change(screen.getByPlaceholderText('Member count'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Established date'), { target: { value: '2023-01-15' } });
    fireEvent.change(screen.getByPlaceholderText('Club description and activities...'), { target: { value: 'Test description' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('Add Club'));
  
    await waitFor(() => {
      expect(api.addClub).toHaveBeenCalledWith({
        clubName: 'Test Club',
        category: 'Sports',
        description: 'Test description',
        presidentEmail: 'test@example.com',
        memberCount: 25,
        establishedDate: '2023-01-15',
        status: 'Active',
      });
    });
  
    // Also wrap this in waitFor
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  test('updates club successfully', async () => {
    const mockClub = {
      clubName: 'Existing Club',
      category: 'Technical',
      description: 'Existing description',
      presidentEmail: 'existing@example.com',
      memberCount: 30,
      establishedDate: '2022-05-10',
      status: 'Active',
    };

    api.getClubById.mockResolvedValueOnce(mockClub);
    api.updateClub.mockResolvedValueOnce();

    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} editId="1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Club')).toBeInTheDocument();
    });

    // Update the club name
    const clubNameInput = screen.getByPlaceholderText('Club name');
    fireEvent.change(clubNameInput, { target: { value: 'Updated Club' } });

    // Submit the form
    fireEvent.click(screen.getByText('Update Club'));

    await waitFor(() => {
      expect(api.updateClub).toHaveBeenCalledWith('1', {
        clubName: 'Updated Club',
        category: 'Technical',
        description: 'Existing description',
        presidentEmail: 'existing@example.com',
        memberCount: 30,
        establishedDate: '2022-05-10',
        status: 'Active',
      });
    });

    // Wait for the onAdd callback to be called after the API call completes
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  test('displays success message on add/update', async () => {
    api.addClub.mockResolvedValueOnce();

    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} />);

    fireEvent.change(screen.getByPlaceholderText('Club name'), { target: { value: 'Test Club' } });
    fireEvent.change(screen.getByPlaceholderText('President email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Member count'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Established date'), { target: { value: '2023-01-15' } });
    fireEvent.change(screen.getByPlaceholderText('Club description and activities...'), { target: { value: 'Test description' } });

    fireEvent.click(screen.getByText('Add Club'));

    await waitFor(() => {
      expect(screen.getByText('Club added successfully')).toBeInTheDocument();
    });
  });

  test('updates club name correctly', async () => {
    const mockClub = {
      clubName: 'Original Name',
      category: 'Academic',
      description: 'Test description',
      presidentEmail: 'test@example.com',
      memberCount: 20,
      establishedDate: '2023-01-01',
      status: 'Active',
    };

    api.getClubById.mockResolvedValueOnce(mockClub);
    api.updateClub.mockResolvedValueOnce();

    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} editId="1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Original Name')).toBeInTheDocument();
    });

    const clubNameInput = screen.getByPlaceholderText('Club name');
    fireEvent.change(clubNameInput, { target: { value: 'New Club Name' } });

    fireEvent.click(screen.getByText('Update Club'));

    await waitFor(() => {
      expect(api.updateClub).toHaveBeenCalledWith('1', expect.objectContaining({
        clubName: 'New Club Name',
      }));
    });
  });

  test('renders success message on update', async () => {
    const mockClub = {
      clubName: 'Test Club',
      category: 'Academic',
      description: 'Test description',
      presidentEmail: 'test@example.com',
      memberCount: 20,
      establishedDate: '2023-01-01',
      status: 'Active',
    };

    api.getClubById.mockResolvedValueOnce(mockClub);
    api.updateClub.mockResolvedValueOnce();

    render(<ClubForm onAdd={mockOnAdd} setError={mockSetError} editId="1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Club')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Update Club'));

    await waitFor(() => {
      expect(screen.getByText('Club updated successfully')).toBeInTheDocument();
    });
  });

 
});

// ============================================================================
// CLUB LIST COMPONENT TESTS
// ============================================================================
describe('ClubList Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders clubs in table', () => {
    renderWithRouter(<ClubList clubs={mockClubs} onChange={mockOnChange} />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Club Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('President')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Established')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    expect(screen.getByText('Computer Science Club')).toBeInTheDocument();
    expect(screen.getByText('Basketball Club')).toBeInTheDocument();
    expect(screen.getByText('Drama Society')).toBeInTheDocument();
  });

  test('renders empty state when no clubs', () => {
    renderWithRouter(<ClubList clubs={[]} onChange={mockOnChange} />);
    expect(screen.getByText('No clubs found. Start by creating the first club!')).toBeInTheDocument();
  });

  test('displays club categories correctly', () => {
    renderWithRouter(<ClubList clubs={mockClubs} onChange={mockOnChange} />);
    
    expect(screen.getByText('Technical')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Cultural')).toBeInTheDocument();
  });

  test('displays club statuses correctly', () => {
    renderWithRouter(<ClubList clubs={mockClubs} onChange={mockOnChange} />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });

  test('displays president emails correctly', () => {
    renderWithRouter(<ClubList clubs={mockClubs} onChange={mockOnChange} />);
    
    expect(screen.getByText('president@csclub.com')).toBeInTheDocument();
    expect(screen.getByText('captain@basketball.com')).toBeInTheDocument();
    expect(screen.getByText('director@drama.com')).toBeInTheDocument();
  });
  test('handles null clubs response', async () => {
    api.getAllClubs.mockResolvedValueOnce(null);
    render(<AppWithoutRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('No clubs found. Start by creating the first club!')).toBeInTheDocument();
    });
  });
 
});