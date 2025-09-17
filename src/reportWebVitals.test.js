import reportWebVitals from './reportWebVitals';

describe('reportWebVitals', () => {
  const mockOnPerfEntry = jest.fn();
  
  // Mock the entire 'web-vitals' module before the tests run
  const mockWebVitals = {
    getCLS: jest.fn(),
    getFID: jest.fn(),
    getFCP: jest.fn(),
    getLCP: jest.fn(),
    getTTFB: jest.fn(),
  };

  jest.mock('web-vitals', () => mockWebVitals);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call all web-vitals functions when a valid onPerfEntry function is provided', async () => {
    reportWebVitals(mockOnPerfEntry);
    
    // Use a promise to wait for the async import to resolve
    await new Promise(process.nextTick);

    expect(mockWebVitals.getCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockWebVitals.getFID).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockWebVitals.getFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockWebVitals.getLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(mockWebVitals.getTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });

  it('should not call any web-vitals functions if onPerfEntry is not a function', async () => {
    reportWebVitals(undefined);
    reportWebVitals(null);
    reportWebVitals("not a function");

    // Await a promise to ensure the async import has a chance to resolve
    await new Promise(process.nextTick);

    expect(mockWebVitals.getCLS).not.toHaveBeenCalled();
    expect(mockWebVitals.getFID).not.toHaveBeenCalled();
    expect(mockWebVitals.getFCP).not.toHaveBeenCalled();
    expect(mockWebVitals.getLCP).not.toHaveBeenCalled();
    expect(mockWebVitals.getTTFB).not.toHaveBeenCalled();
  });
});